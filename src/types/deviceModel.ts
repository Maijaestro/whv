// -----------------------------
// 1. Device-Typen
// -----------------------------
export type DeviceType =
  | "switch"
  | "contact"
  | "dimmer"
  | "thermostat"
  | "sensor"
  | "special";

export type DeviceCategory =
  | "light"
  | "logic"
  | "window"
  | "heating"
  | "power"
  | "appliance"
  | "other";

// -----------------------------
// 2. Location
// -----------------------------
export interface Location {
  house?: string;
  floor?: string;
  room?: string;
  area?: string; // Garten, Garage, Außenbereich
}

// -----------------------------
// 3. Capability-Typen
// -----------------------------
export type CapabilityType =
  | "onOff"
  | "binarySensor"
  | "select"
  | "level"
  | "temperature"
  | "humidity"
  | "targetTemperature"
  | "statusText"
  | "specialControl";

// -----------------------------
// 4. Basis-Capability
// -----------------------------
export interface CapabilityBase {
  type: CapabilityType;
  label?: string;
  icon?: string;
}

// -----------------------------
// 5. Capability-Varianten
// -----------------------------

// Ein/Aus (Schalter, Steckdose, Licht)
export interface OnOffCapability extends CapabilityBase {
  type: "onOff";
  stateId: string;
  writable: boolean;
  relative?: { state: string };
  value?: boolean;
}

export interface SelectCapability extends CapabilityBase {
  type: "select";
  stateId: string;
  writable: boolean;
  options: Array<string | number>;
  relative?: { state: string };
  value?: string | number;
}

// Fensterkontakt, Türkontakt, Alarm
export interface BinarySensorCapability extends CapabilityBase {
  type: "binarySensor";
  stateId: string;
  trueLabel?: string;
  falseLabel?: string;
  relative?: { state: string };
  value?: boolean;
}

// Dimmer, Rolladen, Level-Geräte
export interface LevelCapability extends CapabilityBase {
  type: "level";
  targetId: string;
  actualId?: string;
  min?: number;
  max?: number;
  relative?: {
    target: string;
    actual?: string;
  };
  targetValue?: number;
  actualValue?: number;
}

// Temperatur, Luftfeuchte
export interface TemperatureCapability extends CapabilityBase {
  type: "temperature";
  stateId: string;
  unit?: string;
  relative?: { state: string };
  value?: number;
}

export interface TargetTemperatureCapability extends CapabilityBase {
  type: "targetTemperature";
  stateId: string;
  unit?: string;
  relative?: { state: string };
  value?: number;
}

export interface HumidityCapability extends CapabilityBase {
  type: "humidity";
  stateId: string;
  unit?: string;
  relative?: { state: string };
  value?: number;
}

// Spezialgeräte (EVCC, Wärmepumpe, Waschmaschine fertig)
export interface SpecialControlCapability extends CapabilityBase {
  type: "specialControl";
  kind: "evcc" | "heatpump" | "washerDone" | "custom";
  datapoints: Record<string, string>;
  relative?: Record<string, string>;
}

// -----------------------------
// 6. Capability Union
// -----------------------------
export type Capability =
  | OnOffCapability
  | SelectCapability
  | BinarySensorCapability
  | LevelCapability
  | TemperatureCapability
  | TargetTemperatureCapability
  | HumidityCapability
  | SpecialControlCapability;

// -----------------------------
// 7. Device
// -----------------------------
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  category: DeviceCategory;
  location: Location;
  favorite: boolean;

  // absolute Datenpunkte (nach Discovery)
  datapoints: Record<string, string>;

  // Fähigkeiten des Geräts
  capabilities: Capability[];

  // Basis-Pfad für relative IDs (z.B. "hm-rpc.0.FK12345")
  baseId?: string;
}
