import { DeviceType, DeviceCategory, Capability } from "@/types/deviceModel";

//
// TEMPLATE BASIS
//
export interface DeviceTemplate {
  type: DeviceType;
  category: DeviceCategory;
  label?: string;

  // relative Pfade, die später mit baseId kombiniert werden
  relativeDatapoints: Record<string, string>;

  // Capabilities mit relativen Pfaden
  capabilities: Capability[];
}

//
// SWITCH TEMPLATE
// (Lichtschalter, Steckdose, generischer On/Off)
//
export const SwitchTemplate: DeviceTemplate = {
  type: "switch",
  category: "light",
  label: "Schalter",

  relativeDatapoints: {
    state: "1.STATE",
  },

  capabilities: [
    {
      type: "onOff",
      label: "Schalten",
      writable: true,
      relative: { state: "1.STATE" },
      stateId: "", // wird später durch Discovery ersetzt
    },
  ],
};

//
// LOGIC SWITCH TEMPLATE
// Virtuelle Schalter / Betriebsmodi / Szenen
//
export const LogicSwitchTemplate: DeviceTemplate = {
  type: "switch",
  category: "logic",
  label: "Logik-Schalter",

  relativeDatapoints: {
    state: "1.STATE",
  },

  capabilities: [
    {
      type: "select",
      label: "Modus",
      writable: true,
      options: [],
      relative: { state: "1.STATE" },
      stateId: "",
    },
  ],
};

//
// CONTACT TEMPLATE
// (Fensterkontakt, Türkontakt, Reed-Sensor)
//
export const ContactTemplate: DeviceTemplate = {
  type: "contact",
  category: "window",
  label: "Fensterkontakt",

  relativeDatapoints: {
    state: "1.STATE",
  },

  capabilities: [
    {
      type: "binarySensor",
      label: "Kontakt",
      trueLabel: "offen",
      falseLabel: "geschlossen",
      relative: { state: "1.STATE" },
      stateId: "",
    },
  ],
};

//
// DIMMER TEMPLATE
// (Licht-Dimmer, Rolladen, Level-Geräte)
//
export const DimmerTemplate: DeviceTemplate = {
  type: "dimmer",
  category: "light",
  label: "Dimmer",

  relativeDatapoints: {
    target: "1.SET",
    actual: "1.ACTUAL",
  },

  capabilities: [
    {
      type: "level",
      label: "Helligkeit",
      min: 0,
      max: 100,
      relative: {
        target: "1.SET",
        actual: "1.ACTUAL",
      },
      targetId: "",
      actualId: "",
    },
  ],
};

//
// THERMOSTAT TEMPLATE
// (Heizung, Raumklima)
//
export const ThermostatTemplate: DeviceTemplate = {
  type: "thermostat",
  category: "heating",
  label: "Thermostat",

  relativeDatapoints: {
    tempActual: "1.ACTUAL",
    tempTarget: "1.SET",
    humidity: "1.HUMIDITY",
  },

  capabilities: [
    {
      type: "temperature",
      label: "Temperatur",
      unit: "°C",
      relative: { state: "1.ACTUAL" },
      stateId: "",
    },
    {
      type: "targetTemperature",
      label: "Soll",
      unit: "°C",
      relative: { state: "1.SET" },
      stateId: "",
    },
    {
      type: "humidity",
      label: "Luftfeuchte",
      unit: "%",
      relative: { state: "1.HUMIDITY" },
      stateId: "",
    },
  ],
};

//
// SPECIAL TEMPLATE: EVCC / Energie / Wallbox
//
export const EvccTemplate: DeviceTemplate = {
  type: "special",
  category: "power",
  label: "EVCC / Energie",

  relativeDatapoints: {
    grid: "status.grid",
    batterySoc: "battery.soc",
    pvPower: "pv.power",
    homePower: "home.power",
  },

  capabilities: [
    {
      type: "specialControl",
      kind: "evcc",
      label: "Energie",
      relative: {
        grid: "status.grid",
        batterySoc: "battery.soc",
        pvPower: "pv.power",
        homePower: "home.power",
      },
      datapoints: {},
    },
  ],
};

//
// EXPORT ALLE TEMPLATES
//
export const DeviceTemplates: DeviceTemplate[] = [
  SwitchTemplate,
  ContactTemplate,
  DimmerTemplate,
  ThermostatTemplate,
  EvccTemplate,
  LogicSwitchTemplate,
];
