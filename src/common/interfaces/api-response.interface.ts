import { Status } from "../enums/status.enum";

export interface ApiResponse<T> {
  status: Status;
  message: string;
  data: T | null;
}