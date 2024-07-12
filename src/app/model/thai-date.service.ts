import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate'
})
export class ThaiDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // ตรวจสอบว่ามีค่าวันที่หรือไม่

    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiYearOffset = 543;

    const dateParts = value.split('-');
    if (dateParts.length !== 3) return value; // ตรวจสอบรูปแบบของวันที่

    const year = parseInt(dateParts[0], 10);
    const monthIndex = parseInt(dateParts[1], 10) - 1;

    if (isNaN(year) || isNaN(monthIndex)) return value; // ตรวจสอบรูปแบบของวันที่

    const thaiMonth = thaiMonths[monthIndex];
    const thaiYear = year + thaiYearOffset;

    return `${dateParts[2]} ${thaiMonth} พ.ศ. ${thaiYear}`;
  }
}
