# DEPARTAMENTAL1
PROYECTO DEPARTAMENTAL PARA LA MATERIA DE DESARROLLO DE APLICACIONES WEB


digraph NeonSiegeUltraDetailed {
    rankdir=TB;
    fontname="Helvetica";
    fontsize=12;
    nodesep=0.4;
    ranksep=0.6;
    compound=true;

    node [fontname="Helvetica", fontsize=9, shape=box, style="filled,rounded", fillcolor="#F8FAFC", color="#64748B", penwidth=1];
    edge [fontname="Helvetica", fontsize=8, color="#475569", penwidth=1];

    // Nodos de arranque y fin
    Start [label="Inicio (index.html)", shape=oval, fillcolor="#E0F2FE", color="#0284C7"];
    EndGame [label="Fin de Partida", shape=oval, fillcolor="#FEE2E2", color="#DC2626"];

    // 1. ASSETS Y RED
    subgraph cluster_init {
        label="Fase 1: Inicialización y Red";
        style="filled"; fillcolor="#F1F5F9"; color="#94A3B8";
        InitCanvas [label="Inicializar Canvas 2D y Contexto"];
        LoadAssets [label="AssetManager:\n- Cargar Sprite Sheets (Player, Enemigos, Jefes)\n- Cargar Sonidos y Música"];
        FetchInit [label="Fetch GET /api/scores\nObtener Top 10 JSON"];
        Menu [label="Renderizar Menú Principal"];
    }

    // 2. CONFIGURACIÓN DE PARTIDA
    subgraph cluster_setup {
        label="Fase 2: Instanciación de Sistemas";
        style="filled"; fillcolor="#F1F5F9"; color="#94A3B8";
        SetupPools [label="Crear Object Pools:\n- 300 Proyectiles inactivos\n- 500 Partículas inactivas"];
        SetupGrid [label="Crear Cuadrícula de\nParticionamiento Espacial"];
        SetupPlayer [label="Instanciar Jugador\n(HP: 100, XP: 0, Nivel: 1, Arma: Pistola)"];
    }

    // 3. GAME LOOP CORE
    subgraph cluster_loop {
        label="Fase 3: Game Loop (requestAnimationFrame - 16.6ms)";
        style="dashed"; color="#475569";
        
        CalcDelta [label="Calcular Delta Time\nLimpiar Canvas (clearRect)"];
        
        // INPUT
        subgraph cluster_input {
            label="Procesamiento de Entrada"; color="#CBD5E1";
            ReadKeys [label="Leer Teclas (WASD)\nCalcular vector normalizado"];
            ReadMouse [label="Leer Mouse (X, Y)\nCalcular ángulo (Math.atan2)"];
            ReadActions [label="Detectar teclas de:\n- Habilidad especial\n- Cambio de arma (1,2,3)\n- Modo Debug (F2)"];
        }

        // WAVE SYSTEM
        subgraph cluster_waves {
            label="Director de Juego (Oleadas)"; color="#CBD5E1";
            CheckWaveTime [label="¿Es tiempo de nueva oleada?"];
            IsBoss [label="¿Oleada % 5 == 0?", shape=diamond, fillcolor="#FEF3C7"];
            BossPhase [label="Instanciar Jefe:\n- Fase 1 (100%-60%)\n- Fase 2 (60%-30%)\n- Fase 3 (30%-0%)"];
            EnemySpawn [label="Instanciar fuera de cámara:\n- Hunter (Cuerpo a cuerpo)\n- Ranger (Distancia)\n- Swarm (Enjambre)\n- Tank (Lento/Pesado)\n- Kamikaze (Explosivo)"];
            UpgradeDiff [label="Incrementar: Velocidad, HP,\nDaño o Frecuencia"];
        }

        // UPDATE ENTITIES & FSM
        subgraph cluster_fsm {
            label="Actualización Lógica (IA y Entidades)"; color="#CBD5E1";
            UpdatePlayer [label="Mover Jugador\nAplicar físicas (fricción, velocidad)"];
            EvalFSM [label="Enemigos evalúan variables:\nDistancia, Energía, Tiempo, Daño"];
            SwitchFSM [label="Cambiar Estado:\nSPAWN -> SEARCH -> CHASE\nATTACK -> RETREAT -> DEAD"];
            ProcessWeapons [label="¿Jugador Dispara?"];
            FireWeapon [label="Validar cadencia y energía.\nExtraer de Object Pool.\nAplicar velocidad, daño y dispersión"];
        }

        // FÍSICA Y COLISIONES
        subgraph cluster_physics {
            label="Motor de Colisiones (Optimizado)"; color="#CBD5E1";
            PopulateGrid [label="Asignar Player, Enemigos y\nProyectiles a celdas de la cuadrícula"];
            CheckCollisions [label="Evaluar colisiones matemáticas\nsolo en celdas adyacentes"];
            
            HitPlayer [label="Enemigo toca Jugador:\n- Restar HP\n- Activar invulnerabilidad\n- Reiniciar Combo"];
            HitEnemy [label="Proyectil toca Enemigo:\n- Restar HP Enemigo\n- Retornar proyectil al Pool\n- Instanciar Partículas"];
            HitPickup [label="Jugador toca Gema/Objeto:\n- Sumar XP o Buff"];
        }

        // PROGRESIÓN
        subgraph cluster_progression {
            label="Progresión y Recompensas"; color="#CBD5E1";
            EnemyDie [label="Estado Enemigo = DEAD\nSumar Puntos x Multiplicador\nSoltar Gema XP"];
            CheckLevelUp [label="¿XP >= Meta de Nivel?", shape=diamond, fillcolor="#FEF3C7"];
            LevelUpModal [label="Pausar GameLoop.\nMostrar Opciones (Daño, Vel, Cadencia)\nAplicar mejora real."];
        }

        // RENDER
        subgraph cluster_render {
            label="Fase de Renderizado"; color="#CBD5E1";
            DrawOrder [label="Dibujar en orden:\n1. Fondo\n2. Power-ups\n3. Enemigos (Sprite Sheets)\n4. Jugador (Sprite Sheets)\n5. Proyectiles\n6. Partículas"];
            DrawHUD [label="Dibujar HUD:\nHP, Escudo, Armas, XP, Score"];
            CheckDebug [label="¿F2 Activo?", shape=diamond, fillcolor="#FEF3C7"];
            DrawDebug [label="Dibujar Hitboxes,\nCuadrícula Espacial, FPS,\nContador de Objetos"];
        }
        
        IsAlive [label="¿Player HP > 0?", shape=diamond, fillcolor="#FEE2E2"];
    }

    // 4. BACKEND
    subgraph cluster_backend {
        label="Fase 4: Backend Node.js"; style="filled"; fillcolor="#F1F5F9"; color="#94A3B8";
        PromptName [label="Mostrar modal 'Ingresa tu Nombre'"];
        PostFetch [label="Fetch POST /api/scores\nBody: {name, score, wave, time}"];
        NodeWrite [label="Servidor actualiza scores.json\ny stats.json"];
        GetFetch [label="Fetch GET /api/scores\nRecibir Ranking"];
        ShowLeaderboard [label="Mostrar Tabla de Top 10"];
        AskRestart [label="Botón: Volver a Jugar"];
    }

    // FLUJO PRINCIPAL
    Start -> InitCanvas -> LoadAssets -> FetchInit -> Menu -> SetupPools;
    SetupPools -> SetupGrid -> SetupPlayer -> CalcDelta;

    CalcDelta -> ReadKeys;
    CalcDelta -> ReadMouse;
    CalcDelta -> ReadActions;
    
    ReadKeys -> CheckWaveTime;
    CheckWaveTime -> IsBoss;
    IsBoss -> BossPhase [label="Sí"];
    IsBoss -> EnemySpawn [label="No"];
    EnemySpawn -> UpgradeDiff;
    
    UpgradeDiff -> UpdatePlayer;
    BossPhase -> UpdatePlayer;
    
    UpdatePlayer -> EvalFSM -> SwitchFSM -> ProcessWeapons;
    ProcessWeapons -> FireWeapon [label="Clic presionado"];
    ProcessWeapons -> PopulateGrid [label="Sin disparo"];
    FireWeapon -> PopulateGrid;
    
    PopulateGrid -> CheckCollisions;
    CheckCollisions -> HitPlayer;
    CheckCollisions -> HitEnemy;
    CheckCollisions -> HitPickup;
    
    HitEnemy -> EnemyDie -> CheckLevelUp;
    HitPickup -> CheckLevelUp;
    HitPlayer -> CheckLevelUp;
    
    CheckLevelUp -> LevelUpModal [label="Sí"];
    LevelUpModal -> DrawOrder;
    CheckLevelUp -> DrawOrder [label="No"];
    
    DrawOrder -> DrawHUD -> CheckDebug;
    CheckDebug -> DrawDebug [label="Sí"];
    CheckDebug -> IsAlive [label="No"];
    DrawDebug -> IsAlive;
    
    IsAlive -> CalcDelta [label="Sí (Ciclo sin fin)"];
    IsAlive -> EndGame [label="No"];
    
    EndGame -> PromptName -> PostFetch -> NodeWrite -> GetFetch -> ShowLeaderboard -> AskRestart;
    AskRestart -> SetupPools [label="Reiniciar"];
    AskRestart -> Menu [label="Menú Principal"];
} 