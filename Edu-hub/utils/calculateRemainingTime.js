function calculateRemainingTime(setTimeRemaining) {
    return () => {
      const now = new Date();
      const endOfFirstFiveDays = new Date(
        now.getFullYear(),
        now.getMonth(),
        5,
        23,
        59,
        59,
        999
      );
      const timeDiff = endOfFirstFiveDays - now;
      return timeDiff > 0 ? timeDiff : 0;
    };
  }
export default calculateRemainingTime;