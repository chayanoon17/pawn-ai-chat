"use client";
export const TableSearchBar = ({
  label,
}: {
  label: string;
}) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <div className="text-lg font-semibold capitalize">{label}</div>
      <div className="text-sm text-blue-500">
        วันที่{" "}
        {new Date().toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
    <div className="flex space-x-3">
      <input
        type="text"
        placeholder="ค้นหาชื่อ"
        className="border px-3 py-2 rounded w-64"
      />
      <button className="border px-3 py-2 rounded">เรียงตาม: ชื่อ</button>
    </div>
  </div>
);
