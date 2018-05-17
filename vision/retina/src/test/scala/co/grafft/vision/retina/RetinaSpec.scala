package co.grafft.vision.retina

import org.scalatest._

class RetinaSpec extends FlatSpec with Matchers {
  "The Retina class" should "print version: 0.0.1-SNAPSHOT" in {
    Retina.version shouldEqual "0.0.1-SNAPSHOT"
  }
}