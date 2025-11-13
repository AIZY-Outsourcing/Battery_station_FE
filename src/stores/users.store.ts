import { create } from "zustand";
import { User } from "@/types/admin/users.type";

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  clearUsers: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearUsers: () => set({ users: [], selectedUser: null }),
}));
