package co.grafft.vision.gateway

import org.scalatest._

class GatewaySpec extends FlatSpec with Matchers {
  "The Gateway class" should "print version: 0.1.0-SNAPSHOT" in {
    Gateway.version shouldEqual "0.1.0-SNAPSHOT"
  }
}