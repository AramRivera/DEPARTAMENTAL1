# DEPARTAMENTAL1
PROYECTO DEPARTAMENTAL PARA LA MATERIA DE DESARROLLO DE APLICACIONES WEB


digraph NeonSiegeFlowchart {
    // Configuración general del diagrama
    rankdir=TB;
    fontname="Helvetica, Arial, sans-serif";
    fontsize=12;
    nodesep=0.6;
    ranksep=0.8;

    // Estilos por defecto para nodos y flechas
    node [fontname="Helvetica", fontsize=10, shape=box, style="filled,rounded", fillcolor="#F8FAFC", color="#64748B", penwidth=1.2];
    edge [fontname="Helvetica", fontsize=9, color="#475569", penwidth=1.1];

    // Nodo inicial
    Start [label="Inicio del Juego", shape=oval, fillcolor="#E0F2FE", color="#0284C7", fontcolor="black"];

    // 1. INICIALIZACIÓN
    subgraph cluster_init {
        label="1. Inicialización y Menú";
        style="dashed";
        color="#94A3B8";
        fontcolor="#334155";
        
        InitAssets [label="Precarga de recursos:\nSprite Sheets y Audio"];
        FetchScoresInit [label="Fetch GET /api/scores\n(Cargar Ranking Inicial)"];
        Menu [label="Menú Principal"];
    }

    // 2. GAME LOOP Y SISTEMAS
    subgraph cluster_gameloop {
        label="2. Motor y Game Loop (60 FPS)";
        style="solid";
        color="#64748B";
        fontcolor="#1E293B";
        
        GameInit [label="Inicializar Variables,\nObject Pool y Cuadrícula Espacial"];
        GameLoop [label="Game Loop\n(requestAnimationFrame)"];
        Input [label="Input Independiente:\n- Movimiento (8 direcciones)\n- Apuntado (Cursor)"];
        
        WaveSystem [label="Sistema de Oleadas"];
        IsBossWave [label="¿Oleada\nmúltiplo de 5?", shape=diamond, fillcolor="#FEF3C7", color="#D97706"];
        
        SpawnBoss [label="Instanciar Jefe\n(3 Fases de comportamiento)"];
        SpawnEnemies [label="Instanciar Enemigos:\nHunter, Ranger, Swarm, Tank, Kamikaze"];
        
        FSM [label="Actualizar IA (FSM):\nSPAWN -> SEARCH -> CHASE ->\nATTACK -> RETREAT -> DEAD"];
        
        WeaponSystem [label="Sistema de Armas\n(3 tipos distintos)"];
        Shoot [label="Disparo: Extraer\nproyectil del Object Pool"];
        
        SpatialGrid [label="Actualizar Particionamiento\nEspacial (Cuadrícula)"];
        Collisions [label="Calcular Colisiones Matemáticas:\n- Proyectiles vs Enemigos\n- Jugador vs Enemigos/Pickups"];
        
        EnemyDeath [label="Enemigo Derrotado:\nGenerar Partículas,\nSumar Puntos y Soltar XP"];
        
        CheckXP [label="¿Barra de\nXP Llena?", shape=diamond, fillcolor="#FEF3C7", color="#D97706"];
        UpgradeStats [label="Pantalla de Progresión:\nPausar Juego y\nSeleccionar Mejora"];
        
        Render [label="Renderizado Canvas 2D:\nFondo, Entidades, Partículas y HUD"];
        
        LifeCheck [label="¿HP Jugador\n<= 0?", shape=diamond, fillcolor="#FEF3C7", color="#D97706"];
    }

    // 3. BACKEND NODE.JS
    subgraph cluster_backend {
        label="3. Fin de Partida y Backend";
        style="dashed";
        color="#94A3B8";
        fontcolor="#334155";
        
        GameOver [label="Pantalla Game Over", fillcolor="#FEE2E2", color="#DC2626", fontcolor="black"];
        InputName [label="Solicitar Nombre\ndel Jugador"];
        NodeAPI [label="Fetch POST /api/scores\nGuardar datos en Node.js (JSON)", shape=cylinder, fillcolor="#E0E7FF", color="#4F46E5", fontcolor="black"];
        ShowRanking [label="Mostrar Ranking\nTop 10 Actualizado"];
    }

    // CONEXIONES DEL FLUJO
    Start -> InitAssets;
    InitAssets -> FetchScoresInit;
    FetchScoresInit -> Menu;
    
    Menu -> GameInit [label=" Iniciar Partida"];
    GameInit -> GameLoop;
    GameLoop -> Input;
    
    Input -> WaveSystem;
    WaveSystem -> IsBossWave;
    IsBossWave -> SpawnBoss [label=" Sí"];
    IsBossWave -> SpawnEnemies [label=" No"];
    
    SpawnBoss -> FSM;
    SpawnEnemies -> FSM;
    
    FSM -> WeaponSystem;
    WeaponSystem -> Shoot [label=" Jugador ataca"];
    WeaponSystem -> SpatialGrid [label=" Sin atacar"];
    Shoot -> SpatialGrid;
    
    SpatialGrid -> Collisions;
    Collisions -> EnemyDeath [label=" Enemigo pierde HP"];
    Collisions -> CheckXP [label=" Sin muertes"];
    EnemyDeath -> CheckXP;
    
    CheckXP -> UpgradeStats [label=" Sí"];
    UpgradeStats -> Render;
    CheckXP -> Render [label=" No"];
    
    Render -> LifeCheck;
    LifeCheck -> GameLoop [label=" No (Siguiente Frame)"];
    
    LifeCheck -> GameOver [label=" Sí (Derrota)"];
    GameOver -> InputName;
    InputName -> NodeAPI;
    NodeAPI -> ShowRanking;
    ShowRanking -> Menu [label=" Volver al Menú"];
}