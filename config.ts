export const config = {
  "alerts": [
    {
        "id": 1,
        "name": "first alert",
        "addresses" : [
            "0xF977814e90dA44bFA03b6295A0616a897441aceC",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        ],
        "filter": {},
        "function": (data: any) => {
            if(data.tx_hash === "0x336e1b01e8eeaf8bebef5233aa44eb71fca7939f10464e7ace95afbb9a46a554"){
              return true;
            }
        }
    },
    {
      "id": 2,
      "name": "second alert",
      "addresses" : [
          "demo.eth",
      ],
      "filter": {},
      "function": (data: any) => {
          if(data.tx_hash === "0x336e1b01e8eeaf8bebef5233aa44eb71fca7939f10464e7ace95afbb9a46a554"){
            return true;
          }
      }
  }
  ]
}