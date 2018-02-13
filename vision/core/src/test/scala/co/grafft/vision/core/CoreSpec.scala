package co.grafft.vision.core

import org.scalatest._

class CoreSpec extends FlatSpec with Matchers {
  "The Core class" should "print version: 0.1.0-SNAPSHOT" in {
    Core.version shouldEqual "0.1.0-SNAPSHOT"
  }
}