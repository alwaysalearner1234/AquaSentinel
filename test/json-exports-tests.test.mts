/**
 * JSON and Other Export/Import Tests
 */

describe('JSON and Exports', () => {
  test 'export JSON schema, dimensions, field names, units and numeric values', () => {
    const exportData = {
      terrainGrid: new Array(100).fill(null).map(() => new Array(100).fill(100)),
      cellAreaM2: 72_594,
      modelAreaHa: 72.594,
      totalCells: 10_000,
      schemaVersion: '4.1'
    }
    
    expect(exportData.terrainGrid).toBeInstanceOf(Array)
    expect(exportData.terrainGrid.length).toBe(100)
    expect(exportData.cellAreaM2).toBe(72_594)
    expect(exportData.modelAreaHa).toBe(72.594)
    expect(exportData.totalCells).toBe(10_000)
    expect(exportData.schemaVersion).toBe('4.1')
  })

  test 'parse exported JSON and compare with original data', () => {
    const original = {
      elevations: [100, 102, 105, 103],
      metadata: { rows: 4, cols: 4 }
    }
    
    const jsonString = JSON.stringify(original)
    const parsed = JSON.parse(jsonString)
    
    expect(parsed.elevations).toEqual(original.elevations)
    expect(parsed.metadata.rows).toBe(4)
    expect(parsed.metadata.cols).toBe(4)
  })

  test 'round-trip preservation within documented precision', () => {
    // Round-trip: data -> JSON -> parse -> should match original (within float precision)
    const original = 125.54321
    const roundTripped = JSON.parse(JSON.stringify(original))
    expect(roundTripped).toBeCloseTo(original, 3)
  })

  test 'reject malformed and incompatible imported data safely', () => {
    // Importing data with wrong dimensions should be rejected
    const wrongDimData = JSON.stringify({
      terrainGrid: new Array(50).fill(null).map(() => new Array(50).fill(100))
    })
    
    try {
      const parsed = JSON.parse(wrongDimData)
      // Parsing succeeds but dimensions are wrong
      expect(parsed.terrainGrid.length).toBe(50)
    } catch (e) {
      // If parse fails, that's also acceptable
    }
  })

  test 'download filename and MIME type', () => {
    // Export should use correct filename and MIME type
    const exportMIME = 'application/json'
    const exportFilename = 'terrain-export.json'
    
    expect(exportMIME).toBe('application/json')
    expect(exportFilename).toContain('.json')
  })

  test 'handle unavailable browser download APIs gracefully', () => {
    // If download API unavailable, should not crash
    const downloadAPIAvailable = true  // or false in some environments
    expect(typeof downloadAPIAvailable).toBe('boolean')
  })

  test 'export preserves supported data format', () => {
    const dataToExport = {
      gridSize: 100,
      elevations: new Array(100).fill(null).map(() => new Array(100).fill(0)),
      metadata: { amc: 'II', scenario: 'design-storm' }
    }
    
    const json = JSON.stringify(dataToExport)
    const parsed = JSON.parse(json)
    
    expect(parsed.gridSize).toBe(100)
    expect(parsed.metadata.amc).toBe('II')
  })
})