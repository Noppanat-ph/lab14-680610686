import { useState } from "react";

//1.0.การกำหนด Type ด้วย TypeScript (type RegisterForm)
type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
};

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

//6.4. กการรับ Props (Props Destructuring)
export default function ModalRegister({ onClose }: { onClose: () => void }) {
  //1.1. การสร้าง State สำหรับเก็บข้อมูลฟอร์ม (useState)
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
  });

  //5.1. การประกาศ State สำหรับคุม Checkbox และ Error (useState)
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  //lab ข้อ 2
  const [extra, setExtra] = useState({
    bottle: false,
    shoes: false,
    cap: false,
  });

  const updateExtra = (key: keyof typeof extra) => {
    setExtra((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  //1.2. ฟังก์ชันอัปเดตข้อมูลแบบไดนามิก (updateForm)
  const updateForm = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    //5.2. การอัปเดตฟอร์มพร้อมล้างสถานะ Error
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  // 4.1. ฟังก์ชันคำนวณราคา (computeTotalPayment)
  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) total += selectedPlan.price;

    if (extra.bottle) {
      const item = extraItems.find((e) => e.id === "bottle");
      if (item) total += item.price;
    }
    if (extra.shoes) {
      const item = extraItems.find((e) => e.id === "shoes");
      if (item) total += item.price;
    }
    if (extra.cap) {
      const item = extraItems.find((e) => e.id === "cap");
      if (item) total += item.price;
    }

    if (extra.bottle && extra.shoes && extra.cap) total *= 0.8;

    return total;
  };

  //5.3. ฟังก์ชันตรวจสอบข้อมูลเมื่อกดปุ่ม (registerBtnOnClick)
  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    const total = computeTotalPayment();

    //บันทึกลง localstorage
    const newRegistrant = {
      id: Date.now(),
      fullName: `${form.fname} ${form.lname}`,
      gender: form.gender,
      plan: plans.find((p) => p.id === form.plan)?.label,
      extraItems: extraItems
        .filter((item) => extra[item.id as keyof typeof extra])
        .map((item) => item.label),
      total: total,
    };

    const oldData = localStorage.getItem("registrants");

    const registrants = oldData ? JSON.parse(oldData) : [];

    registrants.push(newRegistrant);

    localStorage.setItem("registrants", JSON.stringify(registrants));

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );

    onClose();
  };

  return (
    <>
      {/* 6.2. การสร้างและจัดการ UI Modal */}
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="d-flex gap-2">
                <div>
                  <label className="form-label">First name</label>
                  {/* 1.3. สามารถส่งชื่อฟิลด์และค่าจาก input เมื่อพิมพ์ชื่อ */}
                  <input
                    className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                    value={form.fname}
                    onChange={(e) => updateForm("fname", e.target.value)}
                  />
                  {/* 5.5. การแสดงสถานะ Error บน Bootstrap Form (is-invalid) */}
                  <div className="invalid-feedback">Invalid first name</div>
                </div>
                <div>
                  <label className="form-label">Last name</label>
                  {/* 1.4. สามารถส่งชื่อฟิลด์และค่าจาก input เมื่อพิมพ์ชื่อ */}
                  <input
                    className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                    value={form.lname}
                    onChange={(e) => updateForm("lname", e.target.value)}
                  />
                  {/* 5.5. การแสดงสถานะ Error บน Bootstrap Form (is-invalid) */}
                  <div className="invalid-feedback">Invalid last name</div>
                </div>
              </div>
              <div className="mt-2">
                <label className="form-label">Plan</label>
                {/* 2.1 การควบคุม Select element (Controlled Component) & การเรนเดอร์ ตัวเลือก (Option List) */}
                <select
                  className={"form-select" + (errors.plan ? " is-invalid" : "")}
                  value={form.plan}
                  onChange={(e) => updateForm("plan", e.target.value)}
                >
                  <option value="">Please select..</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.price.toLocaleString()} THB)
                    </option>
                  ))}
                </select>
                {/* 5.6. สำหรับ Bootstrap Form แสดง Invalid plan */}
                <div className="invalid-feedback">Please select a Plan</div>
              </div>
              <div className="mt-2">
                <label className="form-label">Gender</label>
                {/* 3.1 การเช็กสถานะการเลือก (checked) & การอัปเดตค่าเมื่อมีการคลิก (onChange) */}
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="radio"
                    checked={form.gender === "male"}
                    onChange={() => updateForm("gender", "male")}
                  />
                  Male 👨
                  <input
                    className="mx-2 form-check-input"
                    type="radio"
                    checked={form.gender === "female"}
                    onChange={() => updateForm("gender", "female")}
                  />
                  Female 👩
                </div>
                {errors.gender && (
                  <div className="text-danger">Please select gender</div>
                )}
              </div>
              {/* Extra Items */}
              <div>
                <label className="form-label">Extra Item(s)</label>
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={extra.bottle}
                    onChange={() => updateExtra("bottle")}
                  />
                  <label className="form-check-label">
                    Bottle 🍼 (200 THB)
                  </label>
                </div>
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={extra.shoes}
                    onChange={() => updateExtra("shoes")}
                  />
                  <label className="form-check-label">Shoes 👟 (600 THB)</label>
                </div>
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={extra.cap}
                    onChange={() => updateExtra("cap")}
                  />
                  <label className="form-check-label">Cap 🧢 (400 THB)</label>
                </div>
                {/* conditional เมื่อเลือกสินค้าเสริมทั้งหมด ให้แสดง discount*/}
                {extra.bottle && extra.shoes && extra.cap && (
                  <span className="text-success d-block">(20% Discounted)</span>
                )}
              </div>
              <div className="alert alert-primary mt-3" role="alert">
                Promotion📢 Buy all items to get 20% Discount
              </div>

              {/* 4.2. การแสดงผลบน UI (Real-time Rendering) */}
              <div className="mt-3">
                Total Payment : {computeTotalPayment().toLocaleString()} THB
              </div>
            </div>

            <div className="modal-footer">
              <div>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />{" "}
                I agree to the terms and conditions
              </div>
              <button
                className="btn btn-success my-2"
                onClick={registerBtnOnClick}
                disabled={!agree}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
