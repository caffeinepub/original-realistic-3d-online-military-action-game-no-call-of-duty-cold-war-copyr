import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Position, PlayerState, LobbyState, PlayerId, GameMap } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdatePlayerPosition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (position: Position) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePlayerPosition(position);
    },
    onSuccess: (data) => {
      // Use setQueryData to avoid unnecessary re-renders
      queryClient.setQueryData(['playersInGame'], data);
    },
  });
}

export function useGetPlayersInGame() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlayerState[]>({
    queryKey: ['playersInGame'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlayersInGame();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 500, // Poll every 500ms for multiplayer sync
  });
}

export function useGetActiveLobbies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LobbyState[]>({
    queryKey: ['activeLobbies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveLobbies();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 2000, // Poll every 2s for lobby list
  });
}

export function useJoinLobby() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinLobby();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLobbies'] });
    },
  });
}

export function useLeaveLobby() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobbyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.leaveLobby(lobbyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLobbies'] });
    },
  });
}

export function useSelectMap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lobbyId, map }: { lobbyId: bigint; map: GameMap }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.selectMap(lobbyId, map);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLobbies'] });
    },
  });
}

export function useStartGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobbyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startGame(lobbyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playersInGame'] });
    },
  });
}
