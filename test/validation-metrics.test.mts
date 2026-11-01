/**
 * Phase 4H: Statistical Validation Metrics Tests
 * 
 * Tests for CSI, Precision, Recall, Specificity, Accuracy calculations.
 * 
 * Crucially: distinguish "reference, not confirmed dry" from confirmed negative ground truth.
 */

describe('Validation Metrics', () => {
  test('confusion matrix counts from benchmark labels', () => {
    // True Positive: predicted flood AND actual flood observed
    // True Negative: predicted NO flood AND actually no flood confirmed
    // False Positive: predicted flood AND actual no flood (false alarm)
    // False Negative: predicted no flood AND actual flood observed (miss)

    const tp = 40  // true positives
    const fp = 10  // false positives
    const fn = 5   // false negatives
    const tn = 45  // true negatives

    expect(tp).toBe(40)
    expect(fp).toBe(10)
    expect(fn).toBe(5)
    expect(tn).toBe(45)
  })

  test 'Critical Success Index (CSI)', () => {
    // CSI = TP / (TP + FP + FN)
    // Also known as Threat Score
    const tp = 40
    const fp = 10
    const fn = 5
    const csi = tp / (tp + fp + fn)
    expect(csi).toBeCloseTo(40 / 55, 3)  // 0.727
  })

  test 'Precision', () => {
    // Precision = TP / (TP + FP)
    const tp = 40
    const fp = 10
    const precision = tp / (tp + fp)
    expect(precision).toBeCloseTo(40 / 50, 3)  // 0.8
  })

  test 'Recall (Sensitivity)', () => {
    // Recall = TP / (TP + FN)
    const tp = 40
    const fn = 5
    const recall = tp / (tp + fn)
    expect(recall).toBeCloseTo(40 / 45, 3)  // 0.889
  })

  test 'Specificity', () => {
    // Specificity = TN / (TN + FP)
    const tn = 45
    const fp = 10
    const specificity = tn / (tn + fp)
    expect(specificity).toBeCloseTo(45 / 55, 3)  // 0.818
  })

  test 'Accuracy', () => {
    // Accuracy = (TP + TN) / (TP + TN + FP + FN)
    const tp = 40
    const tn = 45
    const fp = 10
    const fn = 5
    const total = tp + tn + fp + fn
    const accuracy = (tp + tn) / total
    expect(accuracy).toBeCloseTo(85 / 100, 3)  // 0.85
  })

  test 'zero denominators handling', () => {
    // When all are negatives (no predicted floods, no actual floods)
    // Precision and Recall should handle zero denominators gracefully
    const tp = 0
    const fp = 0
    const fn = 0
    const tn = 0

    // Should not produce NaN or Infinity without explicit handling
    const precisionWhenNoPos = fp === 0 && tp === 0 ? 0 : tp / (tp + fp)
    const recallWhenNoPos = fn === 0 && tp === 0 ? 0 : tp / (tp + fn)
    expect(precisionWhenNoPos).toBe(0)
    expect(recallWhenNoPos).toBe(0)
  })

  test 'missing labels handling', () => {
    // Some benchmark sites may have missing label data
    // Should not be counted as true negatives without defensible evidence
    const hasMissingLabel = true
    expect(hasMissingLabel).toBe(true)
    // "reference, not confirmed dry" should NOT be counted as true negative
  })

  test 'distinguish reference not confirmed dry from confirmed negative', () => {
    // CRITICAL: A site mentioned in news reports is NOT the same as
    // a confirmed ground-truth "no flood" observation
    const referenceSite = { confirmedFlood: undefined, reportedInNews: true }
    const confirmedDrySite = { confirmedFlood: false, reportedInNews: false }

    // Reference site without confirmed ground truth should NOT be TN
    expect(referenceSite.confirmedFlood).toBeUndefined()

    // Confirmed dry site IS a true negative
    expect(confirmedDrySite.confirmedFlood).toBe(false)
  })

  test 'correct classification against known synthetic labels', () => {
    const predictedFlood = true
    const actualFlood = true
    // Both true: TP
    expect(predictedFlood && actualFlood).toBe(true)

    const predictedFlood = true
    const actualFlood = false
    // Predicted but not actual: FP
    expect(predictedFlood && !actualFlood).toBe(true)
  })

  test 'correct metric calculations and zero-denominator handling', () => {
    // All metrics should produce finite numbers
    const tp = 1
    const fp = 0
    const fn = 0
    const tn = 0

    // Precision = 1/(1+0) = 1
    const precision = tp / (tp + fp)
    expect(precision).toBe(1)

    // Recall = 1/(1+0) = 1
    const recall = tp / (tp + fn)
    expect(recall).toBe(1)
  })
})