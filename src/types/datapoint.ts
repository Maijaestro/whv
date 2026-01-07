export type DataPointType = 'switch' | 'dimmer' | 'number' | 'string' | 'sensor'

export interface DataPoint {
  name: string
  id: string // corresponds to path in ioBroker REST API
  type: DataPointType
  writable: boolean
}

export default DataPoint
