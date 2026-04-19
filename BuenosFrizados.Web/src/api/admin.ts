import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5216/api'

export interface AdminValidationRequest {
    pin: string
}

export interface AdminValidationResponse {
    success: boolean
    message: string
}

export const validateAdminPin = async (pin: string): Promise<AdminValidationResponse> => {
    const response = await axios.post<AdminValidationResponse>(
        `${API_BASE_URL}/api/admin/validate`,
        { pin }
    )
    return response.data
}