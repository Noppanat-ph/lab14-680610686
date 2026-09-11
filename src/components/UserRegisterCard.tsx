import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard({
  registrant,
}: {
  registrant: Registrant;
}) {
  const genderText = registrant.gender === "male" ? "👨 Male" : "👩 Female";
  // registrant.gender === "male"   -> "👨 Male"
  //registrant.gender === "female" -> "👩 Female"
  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between">
        <span className="fw-semibold">{registrant.fullName}</span>
        <span>{registrant.total.toLocaleString()} THB</span>
      </div>
      <small className="text-muted">
        {registrant.plan} · {genderText}
      </small>
      {registrant.extraItems?.length > 0 && (
        <div className="mt-1 d-flex flex-wrap gap-1">
          {registrant.extraItems.map((item, index) => (
            <span className="badge text-bg-light border" key={index}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
