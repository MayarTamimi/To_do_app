import { useState, useEffect, use } from "react";


// class usePasswordValidation  extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       password : '',
//       pattern : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
//       message : "Password must be 8–50 characters with at least one letter and one number.",
//       isValid : false,
//       error : ''
//     }
//   }

//   componentDidMount() {
//     if(this.state.password === '') {
//       this.setState({isValid : false , error : ''})
//     }else if(this.state.pattern.test(this.state.password)) {
//       this.setState({isValid : true , error : ''})
//     }else {
//       this.setState({isValid : false , error : this.state.message})
//     }
//     }
//   }

// export default usePasswordValidation  

const defaultPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const defaultMessage =
  "Password must be 8–50 characters with at least one letter and one number.";

export function usePasswordValidation({
  password = "",
  pattern = defaultPattern,
  message = defaultMessage,
}) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (password === "") {
      setIsValid(false);
      setError("");
    } else if (pattern.test(password)) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError(message);
    }
  }, [password, pattern, message]);

  return { isValid, error };
}
