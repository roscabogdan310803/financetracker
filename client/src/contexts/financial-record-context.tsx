import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const API_URL = import.meta.env.VITE_API_URL as string;

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/financial-records/getAllByUserID/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error("Error fetching records:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch(`${API_URL}/financial-records`, {
        method: "POST",
        body: JSON.stringify(record),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Error adding record:", response.statusText);
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(`${API_URL}/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) => prev.map((r) => (r._id === id ? updatedRecord : r)));
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/financial-records/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) => prev.filter((r) => r._id !== deletedRecord._id));
      } else {
        console.error("Error deleting record:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
  return context;
};
