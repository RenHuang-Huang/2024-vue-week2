import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const showAlert = (title, text, icon, confirmButtonText) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText
  })
}
export default showAlert
