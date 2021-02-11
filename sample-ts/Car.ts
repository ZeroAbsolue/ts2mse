class Car extends AnotherCar implements Vehicle, Bike  { 
    engine: string; // par défaut, Engine est public 

    constructor(engine: string) { 
        super(engine);
        this.engine = engine; 
    } 
} 