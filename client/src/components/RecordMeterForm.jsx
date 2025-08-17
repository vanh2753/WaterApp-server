import { Button, Checkbox, Form, Input, Card } from 'antd';
import { recordErrorMeter } from '../api/job-api';

const RecordMeterForm = () => {

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const { serial_number, customer_name, address, meter_book_number, meter_value } = values;
            const res = await recordErrorMeter(serial_number, customer_name, address, meter_book_number, meter_value);
            if (res.EC === 0) {
                form.resetFields();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='d-flex justify-content-center mt-5 '>
            <div className='' >
                <Card className='' title="Ghi nhận đồng hồ lỗi" style={{ maxWidth: 600, width: '100%', border: '2px solid #ccc' }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
                        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
                        style={{ width: '100%', maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={handleSubmit}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Serial đồng hồ lỗi"
                            name="serial_number"
                            rules={[{ required: true, message: 'Vui lòng nhập ID đồng hồ' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Họ và tên khách hàng"
                            name="customer_name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên khách hàng' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số đọc"
                            name="meter_book_number"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Chỉ số đồng hồ"
                            name="meter_value"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item className='text-center' label={null}>
                            <Button type="primary" htmlType="submit">
                                Tạo công việc mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default RecordMeterForm