export interface CustomRequest extends Express.Request {
    user?: any; // Extend with user information if needed
}

export interface CustomResponse extends Express.Response {
    customSend: (data: any) => void; // Example of a custom response method
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}