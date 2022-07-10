function linearInterpolation(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linearInterpolation(A.x, B.x, t),
        y: linearInterpolation(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polygonsIntersection(pol1, pol2) {
  for (let i = 0; i < pol1.length; i++) {
    for (let j = 0; j < pol2.length; j++) {
      const touch = getIntersection(
        pol1[i],
        pol1[(i + 1) % pol1.length],
        pol2[j],
        pol2[(j + 1) % pol2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
