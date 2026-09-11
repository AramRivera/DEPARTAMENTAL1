# DEPARTAMENTAL1
PROYECTO DEPARTAMENTAL PARA LA MATERIA DE DESARROLLO DE APLICACIONES WEB


flowchart TD
    %% 1. INICIALIZACIÓN
    Start([Inicio del Juego]) --> Init[Precarga de Sprite Sheets y Audio]
    Init --> FetchScores[Fetch GET /api/scores para Ranking]
    FetchScores --> Menu[Menú Principal]

    %% 2. GAME LOOP Y CONTROLES
    Menu -->|Jugar| GameInit[Inicializar Variables, Object Pool y Spatial Grid]
    GameInit --> GameLoop{Game Loop a 60 FPS}
    GameLoop --> Input[Input: Movimiento 8 direcciones y Apuntado independiente]

    %% 3. SISTEMA DE OLEADAS Y JEFES
    Input --> WaveSystem[Sistema de Oleadas]
    WaveSystem --> CheckBoss{¿Oleada múltiplo de 5?}
    CheckBoss -->|Sí| SpawnBoss[Instanciar Jefe con 3 fases de comportamiento]
    CheckBoss -->|No| SpawnEnemies[Spawn de Enemigos: Hunter, Ranger, Swarm, Tank, Kamikaze]

    %% 4. MÁQUINA DE ESTADOS Y COMBATE
    SpawnBoss --> UpdateFSM
    SpawnEnemies --> UpdateFSM
    UpdateFSM[Actualización de IA FSM: SPAWN, SEARCH, CHASE, ATTACK, RETREAT, DEAD] --> WeaponSystem[Sistema de Armas: 3 tipos de arma]
    WeaponSystem --> Disparo[Extraer y disparar proyectil usando Object Pooling]

    %% 5. OPTIMIZACIÓN Y COLISIONES
    Disparo --> SpatialGrid[Actualizar Particionamiento Espacial mediante cuadrícula]
    SpatialGrid --> Collisions[Calcular Colisiones locales sin librerías externas]
    Collisions --> HitCheck[Evaluar: Proyectiles vs Enemigos / Jugador vs Enemigos]

    %% 6. SISTEMA DE PROGRESIÓN Y RENDER
    HitCheck --> DropXP[Enemigo muere: Generar partículas, sumar XP y Puntos]
    DropXP --> LevelUpCheck{¿XP suficiente para nivel?}
    LevelUpCheck -->|Sí| UpgradeScreen[Pausar: Seleccionar mejora de estadísticas]
    UpgradeScreen --> Render
    LevelUpCheck -->|No| Render[Renderizado en Canvas 2D: HUD, Entidades y Partículas]

    %% 7. FIN DE PARTIDA Y PERSISTENCIA
    Render --> LifeCheck{¿Puntos de vida del jugador <= 0?}
    LifeCheck -->|No| GameLoop
    LifeCheck -->|Sí| GameOver[Pantalla Game Over]
    GameOver --> InputName[Ingresar Nombre]
    InputName --> PostScore[Fetch POST /api/scores hacia Node.js JSON]
    PostScore --> ShowRanking[Mostrar Ranking Top 10 actualizado]
    ShowRanking --> Menu