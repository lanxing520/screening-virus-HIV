import {Vector3,Curve3} from "@babylonjs/core/Legacy/legacy"
// 连续三次贝塞尔曲线
export function createBezierPath(
  points: [number, number, number][],
  nbPoints = 30,
): Vector3[] {
  const myPath = points.map((e) => {
    return new Vector3(...e)
  })

  if (points.length < 4) {
    return myPath
    // 不足4个点时使用Catmull-Rom曲线
    // return new Curve3.CreateCatmullRomSpline(points, 20).getPoints()
  }

  const allCurvePoints: Vector3[] = []

  // 每4个点一组创建贝塞尔曲线段
  for (let i = 0; i <= myPath.length - 4; i += 3) {
    const p0 = myPath[i]
    const p1 = myPath[i + 1]
    const p2 = myPath[i + 2]
    const p3 = myPath[i + 3]

    const curve = Curve3.CreateCubicBezier(p0, p1, p2, p3, nbPoints)
    const segmentPoints = curve.getPoints()

    // 避免重复添加连接点
    if (i > 0) {
      segmentPoints.shift()
    }

    allCurvePoints.push(...segmentPoints)
  }

  return allCurvePoints
}
