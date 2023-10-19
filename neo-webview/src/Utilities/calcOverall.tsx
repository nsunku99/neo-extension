

export function calculateOverall(...args: number[]) {

  let count = 0;
  let score = 0;

  args.forEach(val => {
    if (val) {
      count++;
      score += val;
    }
  });

  let color = 'green';
  if (score < 70 && score > 50) {
    color = 'yellow';
  } else if (score <= 50) {
    color = 'red';
  }

  return {
    overallScore: score / count,
    overallColor: color
  }

}

//   // CALCULATING OVERALL SCORE BASED ON RECEIVED METRICS
//   let overall = 0;
//   let count = 0;

//   if (hydScore) {
//     count++;
//     overall += hydScore;
//   }
//   if (fcpScore) {
//     count++;
//     overall += fcpScore;
//   }
//   if (domScore) {
//     count++;
//     overall += domScore;
//   }
//   if (reqScore) {
//     count++;
//     overall += reqScore;
//   }
//   const overallScore = overall / count;