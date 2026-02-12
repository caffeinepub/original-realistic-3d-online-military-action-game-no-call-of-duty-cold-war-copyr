import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PlayerId = Principal;
export interface LobbyState {
    id: bigint;
    owner: PlayerId;
    players: Array<PlayerId>;
}
export type Time = bigint;
export interface Position {
    x: number;
    y: number;
    z: number;
    rotation: number;
}
export interface PlayerState {
    username: string;
    lastUpdated: Time;
    isAlive: boolean;
    position: Position;
    health: bigint;
}
export interface GameState {
    id: bigint;
    isGameStarted: boolean;
    lastUpdate: Time;
    players: Array<PlayerId>;
}
export interface UserProfile {
    username: string;
    gamesPlayed: bigint;
    wins: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    endGame(gameId: bigint): Promise<GameState>;
    getActiveLobbies(): Promise<Array<LobbyState>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayersInGame(): Promise<Array<PlayerState>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinLobby(): Promise<LobbyState>;
    leaveLobby(lobbyId: bigint): Promise<LobbyState>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startGame(players: Array<PlayerId>): Promise<GameState>;
    updatePlayerPosition(position: Position): Promise<Array<PlayerState>>;
}
