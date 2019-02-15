
module.exports =
	{
		"crag": {
			"_id": {
				"type": "Object",
				"structure": {
					"_bsontype": {
						"type": "string",
						"required": true
					},
					"id": {
						"type": "Uint8Array",
						"required": true
					},
					"toHexString": {
						"type": "function",
						"required": true
					},
					"get_inc": {
						"type": "function",
						"required": true
					},
					"getInc": {
						"type": "function",
						"required": true
					},
					"generate": {
						"type": "function",
						"required": true
					},
					"toJSON": {
						"type": "function",
						"required": true
					},
					"equals": {
						"type": "function",
						"required": true
					},
					"getTimestamp": {
						"type": "function",
						"required": true
					},
					"generationTime": {
						"type": "number",
						"required": true
					}
				},
				"required": false
			},
			"name": {
				"type": "string",
				"required": true,
				"unique": true
			},
			"description": {
				"type": "string",
				"required": true
			},
			"sectors": [{
				"name": {
					"type": "string"
				},
				"routes": [{}]
			}],
			"location": {
				"type": "Object",
				"structure": {
					" latitude": {
						"type": "number",
						"required": true
					},
					"longitude": {
						"type": "number",
						"required": true
					}
				},
				"required": true
			}
		},
		"book": {
			"_id": {
				"type": "Object",
				"structure": {
					"_bsontype": {
						"type": "string",
						"required": true
					},
					"id": {
						"type": "Uint8Array",
						"required": true
					},
					"toHexString": {
						"type": "function",
						"required": true
					},
					"get_inc": {
						"type": "function",
						"required": true
					},
					"getInc": {
						"type": "function",
						"required": true
					},
					"generate": {
						"type": "function",
						"required": true
					},
					"toJSON": {
						"type": "function",
						"required": true
					},
					"equals": {
						"type": "function",
						"required": true
					},
					"getTimestamp": {
						"type": "function",
						"required": true
					},
					"generationTime": {
						"type": "number",
						"required": true
					}
				},
				"required": true
			},
			"title": {
				"type": "string",
				"required": true
			},
			"description": {
				"type": "string",
				"required": true
			},
			"author": {
				"type": "Object",
				"structure": {
					"name": {
						"type": "string",
						"required": true
					},
					"surname": {
						"type": "string",
						"required": true
					}
				},
				"required": true
			},
			"__v": {
				"type": "number",
				"required": true
			}
		}
	}