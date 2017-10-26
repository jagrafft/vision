package co.grafft.visionav.vision

import org.scalatest._

class VisionSpec extends FlatSpec with Matchers {
  "The Vision object" should "print version: 0.1.0-SNAPSHOT" in {
    Vision.version shouldEqual "0.1.0-SNAPSHOT"
  }
}