// ดึงปุ่มคำถามทั้งหมดมาเก็บไว้ในตัวแปร
const accordionHeaders = document.querySelectorAll('.accordion-header');

// วนลูปเพื่อใส่คำสั่งให้ทุกๆ ปุ่ม
accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        // สลับคลาส 'active' ให้กับปุ่มที่โดนคลิก (เพื่อหมุนลูกศร)
        this.classList.toggle('active');

        // หา div ที่เป็นคำตอบ ซึ่งอยู่ถัดจากปุ่มที่กด
        const content = this.nextElementSibling;

        // เช็คว่าถ้ามันเปิดอยู่ (maxHeight มีค่า) ให้ปิดมันซะ
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            // ถ้ามันปิดอยู่ ให้เปิดมันโดยตั้งความสูงเท่ากับเนื้อหาข้างใน (scrollHeight)
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});