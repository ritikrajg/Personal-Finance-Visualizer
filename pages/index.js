import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Dashboard from "../components/Dashboard";
import BudgetForm from "../components/BudgetForm";
import BudgetOverview from "../components/BudgetOverview";
import Layout from "../components/Layout";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Set these as refs since they won't change during component lifecycle
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const currentYear = new Date().getFullYear();
  const [editingBudget, setEditingBudget] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Combine fetch functions
  const fetchData = async () => {
    if (status !== "authenticated") return;
    
    try {
      setIsLoading(true);

      // Fetch transactions
      const transactionsResponse = await fetch("/api/transactions");
      if (!transactionsResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

      // Fetch budgets
      const budgetsResponse = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`
      );
      if (!budgetsResponse.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const budgetsData = await budgetsResponse.json();
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when session changes
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleSubmit = async (data) => {
    try {
      const url = editingTransaction
        ? `/api/transactions/${editingTransaction._id}`
        : "/api/transactions";

      const method = editingTransaction ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      await fetchData();
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError(error.message);
    }
  };

  const handleBudgetSubmit = async (budgetData) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...budgetData,
          month: currentMonth,
          year: currentYear,
        }),
      });

      if (!response.ok) throw new Error("Failed to save budget");

      await fetchData();
    } catch (error) {
      console.error("Error saving budget:", error);
      setError(error.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    // Scroll to form
    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(error.message);
    }
  };

  const handleBudgetEdit = async (data) => {
    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          month: currentMonth,
          year: currentYear,
        }),
      });

      if (!response.ok) throw new Error("Failed to update budget");

      await fetchData();
      setEditingBudget(null);
    } catch (error) {
      console.error("Error updating budget:", error);
      setError(error.message);
    }
  };

  const handleBudgetDelete = async (budgetId) => {
    if (!budgetId) {
      throw new Error('Budget ID is required');
    }

    const response = await fetch(`/api/budgets/${budgetId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete budget');
    }

    // Refresh data after successful deletion
    await fetchData();
  };

  // If loading or not authenticated yet, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Dashboard transactions={transactions} />
          <BudgetOverview
            budgets={budgets}
            transactions={transactions}
            onEditBudget={setEditingBudget}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {editingTransaction ? (
            <TransactionForm
              initialData={editingTransaction}
              onSubmit={handleSubmit}
              onCancel={() => setEditingTransaction(null)}
            />
          ) : (
            <TransactionForm onSubmit={handleSubmit} />
          )}

          {editingBudget ? (
            <BudgetForm
              initialData={editingBudget}
              onSubmit={handleBudgetEdit}
              onCancel={() => setEditingBudget(null)}
            />
          ) : (
            <BudgetForm
              onSubmit={handleBudgetSubmit}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          )}

          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}
