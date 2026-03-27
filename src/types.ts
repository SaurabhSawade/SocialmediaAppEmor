import { RowDataPacket } from "mysql2";

// User interface for MySQL users table
export interface IUser extends RowDataPacket {
  id?: number;        
  name: string;
  email: string;
  password: string;
}

// // Message interface for MySQL messages table
// export interface IMessage extends RowDataPacket {
//   id?: number;          
//   senderid: number;    
//   receiverid: number;  
//   message: string;
//   created_at?: Date;
//   updated_at?: Date;
// }

export interface IMessage extends RowDataPacket {
  id?: number;          
  sender_id: number;    
  receiver_id: number;  
  message: string;
  created_at?: Date;
  updated_at?: Date;
}