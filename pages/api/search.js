

export default function handler(req, res) {
  console.log(req.body)
  return res.status(200).send({data: 'good request'})
}