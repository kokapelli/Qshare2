import Axios from "axios"
import { settings } from "../settings/settings";

const axios = Axios.create()
axios.defaults.headers.common['Provider'] = settings.provider

export default axios