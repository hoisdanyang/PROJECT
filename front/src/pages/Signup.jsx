import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { register, checkUserId } from "../api/authApi";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    pw: "",
    pw2: "",
    name: "",
    address: "",
    addressDetail: "",
    phone: "",
    email: "",
    social: "",
    petType: "",
    gender: "",
    birth: "",
  });

  const [errors, setErrors] = useState({});

  const [idCheck, setIdCheck] = useState({
    done: false,
    ok: false,
    msg: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 아이디 중복확인
  const handleCheckId = async () => {
    if (!form.userId.trim()) {
      setIdCheck({ done: true, ok: false, msg: "아이디를 먼저 입력해주세요." });
      return;
    }

    try {
      const data = await checkUserId(form.userId); // { ok, msg }
      setIdCheck({ done: true, ok: data.ok, msg: data.msg });
    } catch (err) {
      setIdCheck({
        done: true,
        ok: false,
        msg: err.response?.data?.msg || "중복확인 실패",
      });
    }
  };

  const handleAddressSearch = () => {
    setForm((prev) => ({ ...prev, address: "경기도 수원시 (임시 주소)" }));
  };

  // ✅ 회원가입 제출
  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors)[0]);
      return;
    }

    if (!idCheck.done || !idCheck.ok) {
      alert("아이디 중복확인을 완료해주세요.");
      return;
    }

    try {
      await register({
        userId: form.userId,
        password: form.pw, // ⚠️ 백엔드 키 이름과 맞추기
        name: form.name,
        address: form.address,
        addressDetail: form.addressDetail,
        phone: form.phone,
        email: form.email,
        social: form.social,
        petType: form.petType,
        gender: form.gender,
        birth: form.birth,
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "회원가입 실패(서버 오류)");
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.userId.trim()) errors.userId = "아이디는 필수입니다.";
    if (!form.pw.trim()) errors.pw = "비밀번호는 필수입니다.";
    if (!form.pw2.trim()) errors.pw2 = "비밀번호 확인은 필수입니다.";
    if (!form.name.trim()) errors.name = "이름은 필수입니다.";
    if (!form.phone.trim()) errors.phone = "전화번호는 필수입니다.";
    if (!form.email.trim()) errors.email = "이메일은 필수입니다.";
    if (!form.address.trim()) errors.address = "주소는 필수입니다.";

    if (form.pw && form.pw.length < 8) errors.pw = "비밀번호는 8자 이상이어야 합니다.";
    if (form.pw && !/[0-9]/.test(form.pw)) errors.pw = "비밀번호에 숫자를 1개 이상 포함해야 합니다.";
    if (form.pw && !/[A-Za-z]/.test(form.pw)) errors.pw = "비밀번호에 영문을 1개 이상 포함해야 합니다.";
    if (form.pw && form.pw2 && form.pw !== form.pw2) errors.pw2 = "비밀번호가 서로 다릅니다.";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "이메일 형식이 올바르지 않습니다.";
    }

    const phoneOnly = form.phone.replace(/\D/g, "");
    if (form.phone && (phoneOnly.length < 10 || phoneOnly.length > 11)) {
      errors.phone = "전화번호는 숫자만 10~11자 입력해주세요.";
    }

    return errors;
  };

  return (
    <div className={styles.signupWrap}>
      {/* ... (너가 작성한 JSX는 그대로 두고, form onSubmit / 버튼 onClick만 연결하면 됨) */}
      <form onSubmit={onSubmit}>
        {/* 아이디 input */}
        <input
          name="userId"
          value={form.userId}
          onChange={(e) => {
            onChange(e);
            setIdCheck({ done: false, ok: false, msg: "" }); // 아이디 바뀌면 중복확인 초기화
          }}
          placeholder="아이디"
        />

        <button type="button" onClick={handleCheckId}>
          중복확인
        </button>

        {/* ... 나머지 동일 */}
      </form>
    </div>
  );
}

export default Signup;
