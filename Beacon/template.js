const enter1 = (profile) => ({
  type: "flex",
    altText: "Special Deal! For You",
  contents: {
    "type": "bubble",
    "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
              {
                  "type": "text",
                  "text": "Special Deal!",
                  "weight": "bold",
                  "size": "lg",
                  "color": "#FFFFFF"
              },
              {
                  "type": "text",
                  "text": "The highest discount 50%",
                  "color": "#FFFFFF",
                  "weight": "bold",
                  "offsetTop": "md"
              }
          ]
      },
    "body": {
      "type": "box",
      "layout": "vertical",
        "contents": [
            {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Place",
                                "color": "#aaaaaa",
                                "size": "sm",
                                "flex": 1
                            },
                            {
                                "type": "text",
                                "text": "Restaurant Demo, 2nd Floor, Zone A",
                                "wrap": true,
                                "color": "#666666",
                                "size": "sm",
                                "flex": 5
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Time",
                                "color": "#aaaaaa",
                                "size": "sm",
                                "flex": 1
                            },
                            {
                                "type": "text",
                                "text": "11:00 - 21:00",
                                "wrap": true,
                                "color": "#666666",
                                "size": "sm",
                                "flex": 5
                            }
                        ]
                    }
                ]
            }
        ]
      },
      "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
              {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                      "type": "uri",
                      "label": "Information",
                      "uri": "https://liff.line.me/2006214422-V0RrzG1x"
                  },
                  "color": "#06C755"
              },
              {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                      "type": "uri",
                      "label": "Reserve & Order",
                      "uri": "https://liff.line.me/2006214422-Kz3Rr06Y"
                  },
                  "color": "#06C755"
              },
              {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [],
                  "margin": "sm"
              }
          ],
          "flex":0
      },
      "styles": {
          "header": {
              "backgroundColor": "#06C755"
          }
      }
  }
});

const enter2 = (profile) => ({
  type: "flex",
  altText: "Hello LINE Beacon!",
  contents: {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "image",
              "url": "https://store.ais.co.th/media/catalog/product/cache/2/thumbnail/9df78eab33525d08d6e5fb8d27136e95/b/e/beacon6-01.png",
              "size": "full",
              "aspectMode": "cover",
              "aspectRatio": "10:9"
            }
          ]
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": `${profile.pictureUrl}`,
                  "aspectMode": "cover",
                  "size": "full"
                }
              ],
              "cornerRadius": "100px",
              "width": "72px",
              "height": "72px"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "contents": [],
                  "wrap": true,
                  "text": `Hello ${profile.displayName}!`,
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": `${profile.statusMessage}`,
                  "size": "sm"
                }
              ],
              "justifyContent": "center"
            }
          ],
          "spacing": "xl",
          "paddingAll": "20px"
        }
      ],
      "paddingAll": "0px"
    }
  }
});

module.exports = { enter1, enter2 };
