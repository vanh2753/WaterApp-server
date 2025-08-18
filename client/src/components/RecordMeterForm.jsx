import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { recordErrorMeter } from '../api/job-api';

const RecordMeterForm = () => {
    const [formData, setFormData] = useState({
        serial_number: '',
        customer_name: '',
        address: '',
        meter_book_number: '',
        meter_value: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { serial_number, customer_name, address, meter_book_number, meter_value } = formData;
            const res = await recordErrorMeter(serial_number, customer_name, address, meter_book_number, meter_value);
            if (res.EC === 0) {
                setFormData({
                    serial_number: '',
                    customer_name: '',
                    address: '',
                    meter_book_number: '',
                    meter_value: '',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5 ">
            <Card style={{ maxWidth: '600px', width: '100%' }} className="p-3 shadow-sm mx-2">
                <Card.Title className="text-center">Ghi nhận đồng hồ lỗi</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="serial_number">
                        <Form.Label>*Serial đồng hồ lỗi</Form.Label>
                        <Form.Control
                            type="text"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="customer_name">
                        <Form.Label>*Họ và tên khách hàng</Form.Label>
                        <Form.Control
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>*Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="meter_book_number">
                        <Form.Label>Số đọc</Form.Label>
                        <Form.Control
                            type="text"
                            name="meter_book_number"
                            value={formData.meter_book_number}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="meter_value">
                        <Form.Label>Chỉ số đồng hồ</Form.Label>
                        <Form.Control
                            type="text"
                            name="meter_value"
                            value={formData.meter_value}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary" className="px-4 py-2">
                            Tạo công việc mới
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RecordMeterForm;
