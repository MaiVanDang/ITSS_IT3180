import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

export default function VehicleForm({ vehicle }: any) {
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const [formValues, setFormValues] = useState({
    apartmentId: vehicle?.apartmentId || "",
    registerDate: vehicle?.registerDate || getToday(),
    id: vehicle?.id || "",
    category: vehicle?.category || "",
  });
  const vehicleTypeOptions = ["Motorbike", "Car"];

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      console.log(formValues.apartmentId);
      const response = await axios.delete(`http://localhost:8080/api/v1/vehicles/${formValues.apartmentId}`, {
        data: { id: formValues.id }, // Payload gửi kèm
        headers: { "Content-Type": "application/json" }, // Đảm bảo header đúng
      });
      
      // console.log(response.data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Delete vehicle successfull!");
    } catch (error : any) {
      // Xử lý lỗi chi tiết từ backend
      if (error.response) {
        // Có phản hồi từ server
        const errorData = error.response.data;
        switch (error.response.status) {
          case 404: // Not Found - Vehicle Not Found
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          case 400: // Bad Request - Validation Error
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          default:
            toast.error(`Lỗi: ${errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau"}`);
        }
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
      } else {
        // Lỗi khi thiết lập request
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu!");
      }
      console.error("Chi tiết lỗi:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const vehicleData = {
      apartmentId: formValues.apartmentId,
      id: formValues.id,
      category: formValues.category,
      registerDate: formValues.registerDate,
    };

    console.log(vehicleData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/vehicles", vehicleData
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Add vehicle successfull");
    } catch (error : any) {
      // Xử lý lỗi chi tiết từ backend
      if (error.response) {
        // Có phản hồi từ server
        const errorData = error.response.data;
        switch (error.response.status) {
          case 409: // Conflict - Resource Already Exists
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          case 404: // Not Found - Apartment Not Found
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          case 400: // Bad Request - Validation Error
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          default:
            toast.error(`Lỗi: ${errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau"}`);
        }
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
      } else {
        // Lỗi khi thiết lập request
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu!");
      }
      console.error("Chi tiết lỗi:", error);
    }
  };

  return (
    <Form width="400px" onSubmit={handleSubmit}>
      <Form.Fields>
        <FormField>
          <FormField.Label label={"Room"} />
          <FormField.Input
            id="apartmentId"
            type="text"
            value={formValues.apartmentId}
            onChange={handleChange}
          />
        </FormField>

        { <FormField>
          <FormField.Label label={"Date"} />
          <FormField.Input
            id="registerDate"
            type="date"
            value={formValues.registerDate}
            onChange={handleChange}
          />
        </FormField>}

        <FormField>
          <FormField.Label label={"Number"} />
          <FormField.Input
            id="id"
            type="text"
            value={formValues.id}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Selector
        value={formValues.category}
        onChange={handleChange}
        id="category"
        options={vehicleTypeOptions}
        label={"Type:"}
      ></Selector>

      {vehicle ? (
        <Form.Buttons>
          <Button variation="danger" size="medium" onClick={handleDelete}>
            Xóa
            <span>
              <HiTrash />
            </span>
          </Button>
          {/* <Button variation="secondary" size="medium">
            Update
            <span>
              <HiPencil />
            </span>
          </Button> */}
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button size="medium" variation="primary" onClick={handleSubmit}>
            Thêm
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
