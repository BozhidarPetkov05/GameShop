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
    name: string;
    description: string;
    price: number;
    companyId: number;
    company?: CompanyResponse;
    genreId: number;
    genre?: GenreResponse;
    tags?: TagResponse[];
    platforms?: PlatformResponse[];
    releaseDate: string;
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
    status?: StatusResponse;
    shippingAddress: string;
    createdDate: string;
    games?: OrderGameResponse[];
}

export interface OrderRequest {
    shippingAddress: string;
    gameIds: number[];
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
