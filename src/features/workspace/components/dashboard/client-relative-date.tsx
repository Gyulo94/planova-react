import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function ClientRelativeDate({ date }: { date: string | Date }) {
  const [relative, setRelative] = useState("...");

  useEffect(() => {
    if (!date) {
      setRelative("날짜 정보 없음");
      return;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setRelative("유효하지 않은 날짜");
      return;
    }

    setRelative(formatDistanceToNow(d, { locale: ko }) + " 전");
  }, [date]);

  return <span>{relative}</span>;
}
