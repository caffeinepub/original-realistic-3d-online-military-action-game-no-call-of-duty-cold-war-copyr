import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    username : Text;
    gamesPlayed : Nat;
    wins : Nat;
  };

  // Game core types
  public type PlayerId = Principal;
  public type Position = {
    x : Float;
    y : Float;
    z : Float;
    rotation : Float;
  };

  public type PlayerState = {
    position : Position;
    health : Nat;
    isAlive : Bool;
    lastUpdated : Time.Time;
    username : Text;
  };

  public type LobbyState = {
    id : Nat;
    owner : PlayerId;
    players : [PlayerId];
  };

  public type MatchState = {
    id : Nat;
    players : [PlayerId];
    startTime : Time.Time;
    isActive : Bool;
  };

  public type GameState = {
    id : Nat;
    players : [PlayerId];
    lastUpdate : Time.Time;
    isGameStarted : Bool;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let lobbies = Map.empty<Nat, LobbyState>();
  let matches = Map.empty<Nat, MatchState>();
  let playerStates = Map.empty<PlayerId, PlayerState>();
  let games = Map.empty<Nat, GameState>();

  // Actor state for managing IDs
  var nextLobbyId = 1;
  var nextMatchId = 1;
  var nextGameId = 1;

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Only authenticated users can view profiles") };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only users/admins can view profiles for others");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Only authenticated users can save profiles") };
    userProfiles.add(caller, profile);
  };

  // Join a lobby
  public shared ({ caller }) func joinLobby() : async LobbyState {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Only authenticated users can join lobbies") };

    let lobbyId = nextLobbyId;
    nextLobbyId += 1;

    let newLobby : LobbyState = {
      id = lobbyId;
      owner = caller;
      players = [caller];
    };
    lobbies.add(lobbyId, newLobby);
    newLobby;
  };

  // Leave lobby
  public shared ({ caller }) func leaveLobby(lobbyId : Nat) : async LobbyState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave lobbies");
    };

    switch (lobbies.get(lobbyId)) {
      case (null) { Runtime.trap("Lobby not found") };
      case (?lobby) {
        // Verify caller is in the lobby
        let isInLobby = lobby.players.find(func(p) { p == caller });
        if (isInLobby == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You are not in this lobby");
        };

        let remainingPlayers = lobby.players.filter(func(player) { player != caller });
        let newOwner = if (lobby.owner == caller and remainingPlayers.size() > 0) {
          remainingPlayers[0];
        } else {
          lobby.owner;
        };

        let updatedLobby = {
          id = lobbyId;
          owner = newOwner;
          players = remainingPlayers;
        };

        if (remainingPlayers.size() == 0) {
          lobbies.remove(lobbyId);
        } else {
          lobbies.add(lobbyId, updatedLobby);
        };
        updatedLobby;
      };
    };
  };

  // Update player position
  public shared ({ caller }) func updatePlayerPosition(position : Position) : async [PlayerState] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update position");
    };

    let username = switch (userProfiles.get(caller)) {
      case (?profile) { profile.username };
      case (null) { caller.toText() };
    };

    let playerState : PlayerState = {
      position;
      health = 100;
      isAlive = true;
      lastUpdated = Time.now();
      username;
    };

    playerStates.add(caller, playerState);

    let sortedPlayers = playerStates.values().toArray().sort(
      func(a : PlayerState, b : PlayerState) : Order.Order {
        Int.compare(b.lastUpdated, a.lastUpdated);
      }
    );

    sortedPlayers;
  };

  // Get all players in game - open to all authenticated users
  public query ({ caller }) func getPlayersInGame() : async [PlayerState] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view game state");
    };

    playerStates.values().toArray().sort<PlayerState>(
      func(a : PlayerState, b : PlayerState) : Order.Order {
        Int.compare(b.lastUpdated, a.lastUpdated);
      }
    );
  };

  // Get active lobbies - open to all users including guests
  public query ({ caller }) func getActiveLobbies() : async [LobbyState] {
    lobbies.values().toArray();
  };

  // Start a new game
  public shared ({ caller }) func startGame(players : [PlayerId]) : async GameState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start games");
    };

    // Verify caller is in the player list or is admin
    let isInGame = players.find(func(p) { p == caller });
    if (isInGame == null and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You must be a player to start this game");
    };

    let gameId = nextGameId;
    nextGameId += 1;

    let newGame : GameState = {
      id = gameId;
      players;
      lastUpdate = Time.now();
      isGameStarted = true;
    };
    games.add(gameId, newGame);
    newGame;
  };

  // End a game
  public shared ({ caller }) func endGame(gameId : Nat) : async GameState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can end games");
    };

    switch (games.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) {
        // Verify caller is in the game or is admin
        let isInGame = game.players.find(func(p) { p == caller });
        if (isInGame == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only players in this game can end it");
        };

        let updatedGame = {
          id = game.id;
          players = game.players;
          lastUpdate = Time.now();
          isGameStarted = false;
        };
        games.add(gameId, updatedGame);
        updatedGame;
      };
    };
  };
};
