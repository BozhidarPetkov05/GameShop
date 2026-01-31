// Auth
export interface AuthTokenRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface TokenClaims {
    loggedUserId: number;
    isAdmin: boolean;
    username: string;
}

// Users
export interface UserResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

export interface UserRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

// Games
export interface GameResponse {
    id: number;
    title: string;
    description: string;
    price: number;
    genre?: string;
    company?: string;
    tags?: string[];
    platforms?: string[];
}

export interface GameRequest {
    name: string;
    description: string;
    price: number;
    companyId: number;
    genreId: number;
    tagIds: number[];
    platformIds: number[];
    releaseDate: string;
}

// Platforms
export interface PlatformResponse {
    id: number;
    name: string;
    description: string;
}

export interface PlatformRequest {
    name: string;
    description: string;
}

// Genres
export interface GenreResponse {
    id: number;
    name: string;
    description: string;
}

export interface GenreRequest {
    name: string;
    description: string;
}

// Companies
export interface CompanyResponse {
    id: number;
    name: string;
    description: string;
    foundedYear: number;
}

export interface CompanyRequest {
    name: string;
    description: string;
    foundedYear: number;
}

// Tags
export interface TagResponse {
    id: number;
    name: string;
    description: string;
}

export interface TagRequest {
    name: string;
    description: string;
}

// Statuses
export interface StatusResponse {
    id: number;
    name: string;
    description: string;
}

export interface StatusRequest {
    name: string;
    description: string;
}

// Orders
export interface OrderResponse {
    id: number;
    userId: number;
    statusId: number;
    status: string;
    shippingAddress: string;
    createdDate?: string;
    games?: (string | OrderGameResponse)[];
    totalPrice?: number;
}

export interface OrderRequest {
    shippingAddress: string;
    games: string[];
    status?: string;
}

export interface OrderEditRequest {
    shippingAddress: string;
    statusId?: number;
}

export interface OrderGameResponse {
    id: number;
    orderId: number;
    gameId: number;
    game?: GameResponse;
    quantity: number;
}

// Cart (frontend only)
export interface CartItem {
    gameId: number;
    game: GameResponse;
    quantity: number;
}
