const attributes = {
	//general
	style: {
		type: "string",
		default: "list"
	},
	cats: {
		type: "array"
	},
	locations: {
		type: "array"
	},
	orderby: {
		type: "string",
		default: "date"
	},
	sortby: {
		type: "string",
		default: "desc"
	},
	perPage: {
		type: "number",
		default: 6
	},

	//styles
	align: {
		type: "string",
	},

	col_padding: {
		type: "object",
	},
	col_margin: {
		type: "object",
	},
	col_style: {
		type: "object",
		default: {
			["bg-style"]: "normal",
			["bg-color"]: "",
			["hv-bg-color"]: "",
			["border-color"]: "",
			["border-width"]: "",
			["border-style"]: "",
			["border-radius"]: ""
		}
	}

}

export default attributes;