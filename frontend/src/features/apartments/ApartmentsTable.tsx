import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import ApartmentRow from "./ApartmentRow";

interface ApartmentsTableProps {
  keyword: string;
  filterString?: string;
}

const PAGE_SIZE = 10;

export default function ApartmentsTable({ keyword, filterString = "" }: ApartmentsTableProps) {
  const [apartments, setApartments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchApartments = async (page: number = 1) => {
    try {
      setIsLoading(true);

      let filter = "";
      if (filterString) {
        filter = filterString;
      } else if (keyword) {
        filter = `addressNumber~'*${keyword}*'`;
      }

      const url = `http://localhost:8080/api/v1/apartments?size=${PAGE_SIZE}&page=${page}${filter ? `&filter=${filter}` : ""}`;
      const response = await axios.get(url);

      const data = response.data.data;
      setApartments(data.result);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (curPage !== 1) {
      setCurPage(1); // reset lại page về 1 khi filter hoặc keyword thay đổi
    } else {
      fetchApartments(1);
    }
  }, [keyword, filterString]);

  useEffect(() => {
    fetchApartments(curPage);
  }, [curPage]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  return (
    <Table columns="1.5fr 2fr 2fr 1.5fr 1.2fr 1.2fr 1fr">
      <Table.Header>
        <div>Số phòng</div>
        <div>Chủ hộ</div>
        <div>Số điện thoại</div>
        <div>Số lượng thành viên</div>
        <div>Diện tích</div>
        <div>Trạng thái</div>
        <div>Hành động</div>
      </Table.Header>

      {isLoading ? (
        <Table.Row>
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>Đang tải...</div>
        </Table.Row>
      ) : apartments.length > 0 ? (
        apartments.map((apartment, index) => (
          <ApartmentRow
            key={apartment.id}
            apartment={apartment}
            index={(curPage - 1) * PAGE_SIZE + index + 1}
          />
        ))
      ) : (
        <Table.Row>
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            Không tìm thấy căn hộ nào phù hợp
          </div>
        </Table.Row>
      )}

      <Table.Footer>
        <Pagination
          totalPages={totalPages}
          curPage={curPage}
          totalElements={totalElements}
          onPageChange={handlePageChange}
        />
      </Table.Footer>
    </Table>
  );
}
