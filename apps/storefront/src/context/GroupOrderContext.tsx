import React, { createContext, useState, useContext, ReactNode } from 'react';
import { GroupOrderData } from '../components/product/GroupOrderModal';

// Mock data for group ordering
export const mockGroupMembers = [
  { name: "John Doe", email: "john.doe@example.com", avatar: "https://bit.ly/dan-abramov" },
  { name: "Jane Smith", email: "jane.smith@example.com", avatar: "https://bit.ly/tioluwani-kolawole" },
  { name: "Bob Johnson", email: "bob.johnson@example.com", avatar: "https://bit.ly/ryan-florence" },
  { name: "Alice Brown", email: "alice.brown@example.com", avatar: "https://bit.ly/prosper-baba" },
];

// Define a type for the objects that can be assigned users
interface HasExtendedProperties {
  xp?: Record<string, unknown>;
}

interface GroupOrderContextType {
  groupOrder: GroupOrderData | null;
  setGroupOrder: (order: GroupOrderData | null) => void;
  assignUsersToLineItems: <T extends HasExtendedProperties>(lineItems: T[]) => T[];
}

const GroupOrderContext = createContext<GroupOrderContextType | undefined>(undefined);

export const GroupOrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groupOrder, setGroupOrder] = useState<GroupOrderData | null>(null);

  const assignUsersToLineItems = <T extends HasExtendedProperties>(lineItems: T[]): T[] => {
    return lineItems.map((item, index) => {
      const userIndex = index % mockGroupMembers.length;
      return {
        ...item,
        xp: {
          ...(item.xp || {}),
          addedBy: mockGroupMembers[userIndex]
        }
      };
    });
  };

  return (
    <GroupOrderContext.Provider 
      value={{ 
        groupOrder, 
        setGroupOrder,
        assignUsersToLineItems
      }}
    >
      {children}
    </GroupOrderContext.Provider>
  );
};

export const useGroupOrder = (): GroupOrderContextType => {
  const context = useContext(GroupOrderContext);
  if (context === undefined) {
    throw new Error('useGroupOrder must be used within a GroupOrderProvider');
  }
  return context;
}; 