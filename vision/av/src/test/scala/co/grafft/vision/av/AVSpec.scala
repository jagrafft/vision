package co.grafft.vision.av

import org.scalatest._

class AVSpec extends FlatSpec with Matchers {
  "The AV class" should "print version: 0.1.0-SNAPSHOT" in {
    AV.version shouldEqual "0.1.0-SNAPSHOT"
  }
}