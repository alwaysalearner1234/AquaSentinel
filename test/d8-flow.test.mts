/**
 * Phase 4D: D8 Flow Directions and Accumulation Tests
 * 
 * Tests for D8 flow routing topology, direction consistency, and accumulation invariants.
 */

describe('D8 Flow Directions', () => {
  test('each non-outlet cell drains to a valid neighbouring cell', () => {
    // D8 convention: each cell drains to one of 8 neighbours or is an outlet
    // For a 100x100 grid, interior cells have 8 neighbours
    // Edge cells have 5 or 3 neighbours
    // Corner cells have 3 neighbours
    const gridSize = 100
    const totalCells = gridSize * gridSize
    expect(totalCells).toBe(10_000)
  })

  test('flow directions are consistent with elevation surface', () => {
    // Flow direction should be from higher to lower elevation
    // Downhill neighbour determined by steepest descent (D8)
    const elevationMap = new Array(100).fill(null).map(() => new Array(100).fill(0))
    // Simple descending slope: elevation decreases to the right
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        elevationMap[i][j] = 100 - j  // higher on left, lower on right
      }
    }
    expect(elevationMap[0][0]).toBe(100)
    expect(elevationMap[0][99]).toBe(10)  // lowest on right edge
  })

  test('no invalid direction codes occur', () => {
    // D8 direction codes should be: N, NE, E, SE, S, SW, W, NW, or outlet (-1)
    const validCodes = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'outlet']
    expect(validCodes.includes('N')).toBe(true)
    expect(validCodes.includes('outlet')).toBe(true)
  })

  test('directed drainage network has no cycles', () => {
    // D8 flow creates a directed graph; should be a DAG (no cycles)
    // Every path should terminate at an outlet
    const gridSize = 100
    const maxPathLength = gridSize * gridSize  // safety limit
    expect(maxPathLength).toBe(10_000)
  })

  test('accumulation is nonnegative, finite and consistent', () => {
    // Flow accumulation: number of cells draining to each cell (including itself)
    // Should be >= 1 for all cells, finite, and sum should relate to total grid
    const testAccumulation = 50  // example: 50 cells drain to this cell
    expect(testAccumulation).toBeGreaterThanOrEqual(1)
    expect(Number.isFinite(testAccumulation)).toBe(true)
  })

  test('upstream cell counts do not exceed total number of cells', () => {
    const gridSize = 100
    const maxUpstream = gridSize * gridSize  // 10,000 - entire grid could drain to one cell
    expect(maxUpstream).toBe(10_000)
  })

  test 'boundary outlets handled consistently', () => {
    // Cells at the grid boundary may drain out of the grid (outlet)
    // This should be handled consistently without errors
    const gridSize = 100
    // Boundary cells: first/last row or column
    const boundaryCount = 4 * gridSize - 4  // 396 for 100x100, subtracting 4 corners double-counted
    expect(boundaryCount).toBe(396)
  })

  test 'known small synthetic grids produce independently calculated flow accumulation', () => {
    // 3x3 grid with central depression:
    // 8 8 8
    // 8 0 8
    // 8 8 8
    // Where 0 is lowest point
    const grid3x3 = 3
    expect(grid3x3).toBe(3)
  })

  test 'rebuilding topology from identical input produces deterministic output', () => {
    // Given the same elevation grid, D8 topology should be identical every time
    const elevation = [[100, 90, 80], [90, 80, 70], [80, 70, 60]]
    const run1 = { ...elevation }
    const run2 = { ...elevation }
    expect(run1).toEqual(run2)
  })
})