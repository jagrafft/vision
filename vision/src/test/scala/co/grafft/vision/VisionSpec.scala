package co.grafft.vision.vision

import org.scalatest._

class VisionSpec extends FlatSpec with Matchers {
  "The Vision class" should "print version: 0.1.0-SNAPSHOT" in {
    Vision.version shouldEqual "0.1.0-SNAPSHOT"
  }
}