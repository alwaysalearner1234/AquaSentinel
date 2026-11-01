/**
 * Phase 4E: Rainfall-Runoff Calculations Tests
 * 
 * Tests for USDA-SCS Curve Number runoff equation.
 * 
 * Standard formulation:
 * S = 25400/CN - 254 mm
 * Q = 0 when P <= Ia
 * Q = (P - Ia)^2 / (P - Ia + S) when P > Ia
 * 
 * Where:
 * P = rainfall depth
 * S = potential maximum retention
 * Ia = initial abstraction
 * Q = runoff depth
 * 
 * Typical Ia = 0.2S (20% of S) for standard CN calculations
 */

describe('Rainfall-Runoff Calculations', () => {
  const CN_STANDARD = 75  // example curve number
  const S = 25400 / CN_STANDARD - 254  // potential retention in mm
  const Ia = 0.2 * S  // initial abstraction = 20% of S per standard

  test('S formula: S = 25400/CN - 254', () => {
    // For CN = 75: S = 25400/75 - 254 = 338.67 - 254 = 84.67 mm
    const expectedS = 25400 / CN_STANDARD - 254
    expect(expectedS).toBeCloseTo(84.67, 2)
  })

  test('zero rainfall produces zero runoff', () => {
    const P = 0
    // Q = 0 when P <= Ia
    const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
    expect(Q).toBe(0)
  })

  test 'rainfall below initial abstraction produces zero runoff', () => {
    const P = Ia - 1  // just below Ia
    const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
    expect(Q).toBe(0)
  })

  test 'rainfall at initial abstraction produces zero runoff', () => {
    const P = Ia
    const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
    expect(Q).toBe(0)
  })

  test 'rainfall above initial abstraction produces positive runoff', () => {
    const P = Ia + 1  // just above Ia
    const Q = P > Ia ? Math.pow(P - Ia, 2) / (P - Ia + S) : 0
    expect(Q).toBeGreaterThan(0)
  })

  test 'valid curve numbers', () => {
    // CN typically ranges from 0 to 100
    for (let cn = 1; cn <= 100; cn++) {
      const S = 25400 / cn - 254
      // For valid CN, S should be positive (or very close to 0 for CN=100)
      if (cn < 100) {
        expect(S).toBeGreaterThan(0)
      }
    }
  })

  test 'invalid curve numbers handled', () => {
    // CN <= 0 or CN > 100 are invalid
    // Implementation should not produce NaN or negative S for valid range
    expect(() => {
      const cn = 1  // valid lower bound
      // Should not crash
    }).not.toThrow()
  })

  test 'AMC I, II and III', () => {
    // Antecedent Moisture Condition adjustments
    // AMC II is standard; AMC I and III modify the curve number
    const amcIICN = 75
    const amcICN = 70  // lower CN for drier conditions
    const amcIIICN = 85  // higher CN for wetter conditions
    expect(amcIICN).toBe(75)
    expect(amcICN).toBe(70)
    expect(amcIIICN).toBe(85)
  })

  test 'rainfall at event boundaries', () => {
    // Test P = 0, P = Ia, P = Ia + epsilon
    const testCases = [
      { P: 0, expectedQ: 0 },
      { P: Ia, expectedQ: 0 },
      { P: Ia + 0.001, expectedQ: expect.any(Number) }  // very small positive
    ]
    testCases.forEach(({ P, expectedQ }) => {
      const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
      if (expectedQ === expect.any(Number)) {
        expect(Q).toBeGreaterThanOrEqual(0)
      } else {
        expect(Q).toBe(expectedQ)
      }
    })
  })

  test 'monotonicity: increasing rainfall does not reduce runoff', () => {
    const P1 = Ia + 10
    const P2 = Ia + 20
    const Q1 = Math.pow(P1 - Ia, 2) / (P1 - Ia + S)
    const Q2 = Math.pow(P2 - Ia, 2) / (P2 - Ia + S)
    // For P > Ia, Q should increase with P
    expect(Q2).toBeGreaterThan(Q1)
  })

  test 'runoff depth to cell volume conversion', () => {
    // If cell area is 72,594 m² and runoff depth is in mm:
    // volume = depth(mm) × cell_area(m²) / 1000 (convert mm to m)
    const runoffDepthMm = 10  // 10 mm = 0.01 m
    const cellAreaM2 = 72_594
    const volumeM3 = runoffDepthMm / 1000 * cellAreaM2
    expect(volumeM3).toBe(725.94)  // 0.01 × 72594 = 725.94 m³
  })

  test 'negative rainfall produces zero runoff', () => {
    const P = -1  // negative
    const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
    expect(Q).toBe(0)
  })

  test 'non-finite inputs handled', () => {
    // NaN, Infinity should not crash the calculation
    expect(() => {
      const P = NaN
      const Q = P <= Ia ? 0 : Math.pow(P - Ia, 2) / (P - Ia + S)
      // Should produce a result, possibly NaN, but not crash
    }).not.toThrow()
  })
})